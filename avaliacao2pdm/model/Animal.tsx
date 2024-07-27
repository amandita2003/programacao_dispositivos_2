export class Animal{
    public id: string;
    public nome: string;
    public sexo: string;
    public datanasc: string;
    public urlfoto: string;

    constructor(obj?: Partial<Animal>){
        if (obj){
            this.id =       obj.id
            this.nome =     obj.nome
            this.sexo =     obj.sexo
            this.datanasc = obj.datanasc
            this.urlfoto =  obj.urlfoto
        }
    }

    toString(){
        const objeto=`{
            "id":       "${this.id}",
            "nome":     "${this.nome}",
            "sexo":     "${this.sexo}",
            "datanasc": "${this.datanasc}",
            "urlfoto":  "${this.urlfoto}"
        }`
        return objeto
    }

    toFirestore(){
        const animal={
            id:       this.id,
            nome:     this.nome,
            sexo:     this.sexo,
            datanasc: this.datanasc,
            urlfoto:  this.urlfoto
        }
        return animal
    }


}