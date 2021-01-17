// AULA SOBRE CLASSES

class EnderecoController {
  constructor(name, address) {
    this.name = name
    this.address = address
  }
  
  getNameAddress() {
    return this.name + this.address
  }
}

const user1 = new EnderecoController('Mayk ', ' Rua X')
console.log(user1.address)

const user2 = new EnderecoController('Douglas ', ' Rua Y')
console.log(user2.name)