def expand_window(game, num_lobbies):
    window_increment = 10
    for i in range (0, num_lobbies):
        game.queue.lobby.window_size += window_increment