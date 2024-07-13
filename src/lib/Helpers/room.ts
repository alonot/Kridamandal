export type Player = {
    name:string,
    joinedAt:string
};

export class Room{
    number_of_players:number;
    players: Player[];
    roomId:number;
    password:string;
    show:boolean;
    websocket:WebSocket | null;

    constructor(){
        this.number_of_players = 0
        this.players = [{
            "name":"Alonot",
            "joinedAt":"23/12/2024:23:15 IST"
        },{
            "name":"Alonot",
            "joinedAt":"23/12/2024:23:15 IST"
        }]
        this.roomId = 123;
        this.password = "asdakjs"
        this.show = false;
        this.websocket = null;
    }

    public clear(){
        this.number_of_players = 0
        this.players = []
        this.roomId = 0;
        this.password = ""
        this.show = false;
        if (this.websocket != null)
            this.websocket.close()
    }

    private generateRoomId() {
        this.roomId = Math.floor(100000 + Math.random() * 900000); // generates 6-digit number
    }

    /**
     * Establishes a connection online
     */
    public connectRooms(nickName:string,password:string,onErr:Function,onOpen:Function){
        this.generateRoomId()
        this.password = password
        this.websocket = new WebSocket('ws://localhost:8001/')
        this.players.push({
            name:nickName,
            joinedAt:Date.now().toString()
        })
        this.websocket.onerror = (e) => {
            onErr()
        }
        this.websocket.onopen = (e)=>{
            const socket = e.target as WebSocket
            // registering ID
            const data = {
                type:"register",
                room_id: this.roomId,
                password: this.password
            }
            socket.send(JSON.stringify(data))
            onOpen()
        }
    }

}