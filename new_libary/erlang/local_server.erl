-module(local_server).
-export([start/0]).

start() ->
    F = fun interact/2,
    spawn(fun() -> start(F, 0) end).

start(F, State0) ->
    {ok, Listen} = gen_tcp:listen(8000, [{packet,raw}, {reuseaddr,true}, {active, true}]),
    par_connect(Listen, F, State0).

par_connect(Listen, F, State0) ->
    case gen_tcp:accept(Listen) of
        {ok, Socket} ->
            spawn(fun() -> par_connect(Listen, F, State0) end),
            wait(Socket, F, State0);
        {error, closed} ->
            {ok, Listen2} = gen_tcp:listen(8000, [{packet,raw}, {reuseaddr,true}, {active, true}]),
            par_connect(Listen2, F, State0)
    end.

wait(Socket, F, State0) ->
    receive
        {tcp, Socket, Data} ->
            Key = list_to_binary(lists:last(string:tokens(hd(lists:filter(fun(S) -> lists:prefix("Sec-WebSocket-Key:", S) end, string:tokens(Data, "\r\n"))), ": "))),
            Challenge = base64:encode(crypto:sha(<< Key/binary, "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" >>)),
            Handshake =
            ["HTTP/1.1 101 Switching Protocols\r\n",
             "connection: Upgrade\r\n",
             "upgrade: websocket\r\n",
             "sec-websocket-accept: ", Challenge, "\r\n",
             "\r\n",<<>>],
            gen_tcp:send(Socket, Handshake),
            send_data(Socket, "Hello, my world"),
            S = self(),
            Pid = spawn_link(fun() -> F(S, State0) end),
            loop(Socket, Pid);
        _Any ->
            wait(Socket, F, State0)
    end.


%%%
%%%is_binary_contain_key([H|L1],Key)->
%%%    Head = binary:split(L1,<<58>>),
%%%    is_binary_contain_key(Head),
%%%    <<Key,N/binary>> = H,
%%%	case (N =:= key) of
%%%        true->H;
 %%%       false->is_list_contain_key(L1)
%%%    end.        

%%%recevice_data_handle(BinText)->
%%%	L = binary:split(BinText,<<44>>),
%%%	is_binary_contain_key(L,key).

recevice_data_handle(BinText)->
    L = binary:split(BinText,<<44>>),
    [Head | L1] = L,
    data_detail_handle(Head,L1).

data_detail_handle(MsgHead,MsgBody)->
    ok.


loop(Socket, Pid) ->
    receive
        {tcp, Socket, Data} ->
            Text = websocket_data(Data),
            case Text =/= <<>> of
                true ->
					recevice_data_handle(Text),
                    Pid ! {browser, self(), ["What You said is: ",  Text]};
                false ->
                    ok
            end,
            loop(Socket, Pid);
        {tcp_closed, Socket} ->
            ok;
        {send, Data} ->
            send_data(Socket, Data),
            loop(Socket, Pid);
        _Any ->
            loop(Socket, Pid)
    end.
get_current_time()->
	{Hour,Min,Sec} = time(),
	[Hour,Min,Sec].

	
	
interact(Browser, State) ->
    receive
        {browser, Browser, Str} ->
            Browser ! {send, Str},
            interact(Browser, State)
    after 1000 ->
            %Browser ! {send, "clock" ++ get_current_time()},
            interact(Browser, State+1)
    end.

%% 仅处理长度为125以内的文本消息
websocket_data(Data) when is_list(Data) ->
    websocket_data(list_to_binary(Data));
websocket_data(<< 1:1, 0:3, 1:4, 1:1, Len:7, MaskKey:32, Rest/bits >>) when Len < 126 ->
    <<End:Len/binary, _/bits>> = Rest,
    Text = websocket_unmask(End, MaskKey, <<>>),
    Text;
websocket_data(_) ->
    <<>>. 

%% 由于Browser发过来的数据都是mask的,所以需要unmask
websocket_unmask(<<>>, _, Unmasked) ->
    Unmasked;
websocket_unmask(<< O:32, Rest/bits >>, MaskKey, Acc) ->
    T = O bxor MaskKey,
    websocket_unmask(Rest, MaskKey, << Acc/binary, T:32 >>);
websocket_unmask(<< O:24 >>, MaskKey, Acc) ->
    << MaskKey2:24, _:8 >> = << MaskKey:32 >>,
    T = O bxor MaskKey2,
    << Acc/binary, T:24 >>;
websocket_unmask(<< O:16 >>, MaskKey, Acc) ->
    << MaskKey2:16, _:16 >> = << MaskKey:32 >>,
    T = O bxor MaskKey2,
    << Acc/binary, T:16 >>;
websocket_unmask(<< O:8 >>, MaskKey, Acc) ->
    << MaskKey2:8, _:24 >> = << MaskKey:32 >>,
    T = O bxor MaskKey2,
    << Acc/binary, T:8 >>.

%% 发送文本给Client
send_data(Socket, Payload) ->
    Len = iolist_size(Payload),
    BinLen = payload_length_to_binary(Len),
	io:format("send data Payload ~p BinLen ~p ~n",[Payload,BinLen]),
    gen_tcp:send(Socket, [<< 1:1, 0:3, 1:4, 0:1, BinLen/bits >>, Payload]).

payload_length_to_binary(N) ->
    case N of
        N when N =< 125 -> << N:7 >>;
        N when N =< 16#ffff -> << 126:7, N:16 >>;
        N when N =< 16#7fffffffffffffff -> << 127:7, N:64 >>
    end.

