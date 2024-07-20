export class Vacina{
    public id: string;
    public nome: string;
    public dose: string;

    constructor(obj?: Partial<Vacina>){
        if (obj){
            this.id =       obj.id
            this.nome =     obj.nome
            this.dose =     obj.dose
        }
    }

    toString(){
        const objeto=`{
            "id":       "${this.id}",
            "nome":     "${this.nome}",
            "dose":     "${this.dose}",
        }`
        return objeto
    }

    toFirestore(){
        const vacina={
            id:       this.id,
            nome:     this.nome,
            dose:     this.dose,
        }
        return vacina
    }


}