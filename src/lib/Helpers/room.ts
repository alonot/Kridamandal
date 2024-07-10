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
    }


    public generateRoomId() {
        this.roomId = Math.floor(100000 + Math.random() * 900000); // generates 6-digit number
    }

    /**
     * Establishes a connection online
     */
    public connectRooms(){

    }

}