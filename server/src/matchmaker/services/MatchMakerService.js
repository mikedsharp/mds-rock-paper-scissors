"use strict";
exports.__esModule = true;
var socketIo = require("socket.io");
var http_1 = require("http");
var _ = require("lodash");
var MatchMakerService = (function () {
    function MatchMakerService(app, port) {
        this.app = app;
        this.port = port;
        this.players = {};
        this.createServer();
        this.sockets();
        this.listen();
    }
    MatchMakerService.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    MatchMakerService.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    MatchMakerService.prototype.matchPlayers = function () {
        var unmatchedPlayers = _.toArray(_.pickBy(this.players, function (player) {
            return !player.matched;
        }));
        if (unmatchedPlayers.length < 2) {
            return;
        }
        unmatchedPlayers[0].matched = true;
        unmatchedPlayers[1].matched = true;
        console.log("player '" + unmatchedPlayers[0].username + "' matched with player '" + unmatchedPlayers[1].username + "'");
        this.io.sockets.connected[unmatchedPlayers[0].socket].emit('player-matched', {
            opponent: unmatchedPlayers[1].username
        });
        this.io.sockets.connected[unmatchedPlayers[1].socket].emit('player-matched', {
            opponent: unmatchedPlayers[0].username
        });
    };
    MatchMakerService.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running websocket server on port %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            console.log('Connected client on port %s.', _this.port);
            socket.on('register-player', function (data) {
                if (_.toArray(_.pickBy(_this.players)).length === 0) {
                    console.log('starting poller...');
                    _this.poller = setInterval(function () { return _this.matchPlayers(); }, 1000);
                }
                _this.players[socket.id] = {
                    socket: socket.id,
                    username: data.username
                };
                console.log("registered player: " + data.username);
            });
            socket.on('disconnect', function () {
                console.log("client disconnected");
                for (var socketId in _this.players) {
                    if (_this.players[socketId].socket === socket.id) {
                        console.log(_this.players[socketId].username + " disconnected");
                        delete _this.players[socketId];
                        if (_.toArray(_.pickBy(_this.players)).length === 0) {
                            console.log('killing poller...');
                            clearInterval(_this.poller);
                        }
                        break;
                    }
                }
            });
        });
    };
    return MatchMakerService;
}());
exports.MatchMakerService = MatchMakerService;
