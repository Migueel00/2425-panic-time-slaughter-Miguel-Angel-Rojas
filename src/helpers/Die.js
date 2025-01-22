class Die {
    constructor(num_faces){
        this.num_faces = num_faces;
    }

    roll(){
        return Math.floor(Math.random() * this.num_faces) + 1;
    }
}

module.exports = Die;