export class Animal{
    public id: string;
    public nome: string;
    public especie: string;
    public sexo: string;
    public datanasc: string;
    public urlfoto: string;

    constructor(obj?: Partial<Animal>){
        if (obj){
            this.id =       obj.id
            this.nome =     obj.nome
            this.especie =     obj.especie
            this.sexo =     obj.sexo
            this.datanasc = obj.datanasc
            this.urlfoto =  obj.urlfoto
        }
    }

    toString(){
        const objeto=`{
            "id":       "${this.id}",
            "nome":     "${this.nome}",
            "especie":     "${this.especie}",
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
            raca:     this.especie,
            sexo:     this.sexo,
            datanasc: this.datanasc,
            urlfoto:  this.urlfoto
        }
        return animal
    }


}