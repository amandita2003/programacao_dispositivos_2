export class Proprietario{
    public id: string;
    public nome: string;
    public sobrenome: string;
    public cpf: string;
    public datanasc: string;

    constructor(obj?: Partial<Proprietario>){
        if (obj){
            this.id =       obj.id
            this.nome =     obj.nome
            this.sobrenome =    obj.sobrenome
            this.cpf =    obj.cpf
            this.datanasc = obj.datanasc
        }
    }

    toString(){
        const objeto=`{
            "id":       "${this.id}",
            "nome":     "${this.nome}",
            "sobrenome":    "${this.sobrenome}",
            "cpf":    "${this.cpf}",
            "datanasc": "${this.datanasc}"
        }`
        return objeto
    }

    toFirestore(){
        const proprietario={
            id:       this.id,
            nome:     this.nome,
            sobrenome:    this.sobrenome,
            cpf:    this.cpf,
            datanasc: this.datanasc
        }
        return proprietario
    }


}