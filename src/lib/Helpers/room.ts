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
    handler:Function

    constructor(handler:Function){
        console.log("Callwd")
        this.clear()
        this.handler = handler
    }

    public resetRoomID(){
        this.players = []
        this.device_player = null
        this.room_id = 0; 
    }

    public clear(){
        console.log("Clearing")
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
        this.websocket = new WebSocket('ws://localhost:8001/')
        
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

    public create(password:string, name: string){
        this.password = password
        return this.sendMessage({
            "type":"create",
            "room_id":this.generateRoomId(),
            "password":password,
            "name":name
        })
    }

    public join(room_id:number, password:string, name: string){
        this.password = password
        return this.sendMessage({
            "type":"add_player",
            "room_id":room_id,
            "password":password,
            "name":name
        })
    }

}