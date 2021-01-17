// AULA SOBRE CLASSES - HERANÇA

class Person {
  getName() {
    return this.name
  }
}

class Dev extends Person {
  constructor(name) {
    super()
    this.name = name
  }
}

const dev = new Dev('Rodrigo')
console.log(dev.getName())