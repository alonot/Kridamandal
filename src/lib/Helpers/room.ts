export type Player = {
    name:string,
    joined_at:string,
    admin:boolean,
    role:string,
    won:number,
    lost:number
};

export class Room{
    players!: Player[];
    device_player!: Player | null;
    room_id!:number;
    password!:string;
    show!:boolean;
    websocket!:WebSocket | null;
    game!:string
    handler:Function

    constructor(handler:Function){
        // console.log("Callwd")
        this.clear()
        this.handler = handler
    }

    public resetRoomID(){
        this.players = []
        this.device_player = null
        this.room_id = 0; 
        this.game = ""
    }

    public clear(){
        // console.log("Clearing")
        this.players = []
        this.device_player = null
        this.room_id = 0;
        this.password = ""
        this.show = false;
        if (this.websocket != null){
            this.websocket.close()
        }
        this.websocket = null
    }

    private generateRoomId() {
        this.room_id = Math.floor(100000 + Math.random() * 900000); // generates 6-digit number
        return this.room_id
    }

    /**
     * Establishes a connection online
     */
    public async connectRooms(){
        this.websocket = new WebSocket('wss://kridamandal-backend.onrender.com')
        
        return new Promise<boolean>((resolve, reject) => {
            if (this.websocket){
                const handler = this.handler
                this.websocket.onerror = (e) => {
                    resolve(false)
                }
                this.websocket.onopen = (e)=>{
                    resolve(true)
                }
                this.websocket.onmessage = function({data}){
                    handler(JSON.parse(data))
                }
            }
        })
    }

    public leaveRoom(){
        this.clear()
    }


    public sendMessage(data:{}){
        if (this.websocket == null || this.websocket.readyState != this.websocket.OPEN){
            return false;
        }
        this.websocket.send(JSON.stringify(data))
        return true;
    }

    public async create(password:string, name: string){
        if (this.websocket == null || this.websocket.readyState != this.websocket.OPEN){
            await this.connectRooms();
        }
        this.password = password
        return this.sendMessage({
            "type":"create",
            "room_id":this.generateRoomId(),
            "password":password,
            "name":name
        })
    }

    public async join(room_id:number, password:string, name: string){
        if (this.websocket == null || this.websocket.readyState != this.websocket.OPEN){
            await this.connectRooms();
        }
        this.password = password
        return this.sendMessage({
            "type":"add_player",
            "room_id":room_id,
            "password":password,
            "name":name
        })
    }

    public startGame(players:string[]){
        if (this.game == "") return false
        return this.sendMessage({
            "type":"initialize",
            "players":players,
            "gameName": this.game
        })
    }

    public sendReadySignal(){
        return this.sendMessage({
            "type":'player_ready'
        })
    }

    public sendNotReadyResponse(){
        return this.sendMessage({
            'type':'cancel'
        })
    }

    public sendMove(move:any){
        return this.sendMessage({
            'type':'play',
            'move':move
        })
    }

    public cancelGame(){
        return this.sendMessage({
            'type':'cancel'
        })
    }

}