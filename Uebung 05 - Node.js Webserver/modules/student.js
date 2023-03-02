class Student {

    constructor(name, note) {
        this._name = name;
        this._note = note;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get note() {
        return this._note;
    }

    set note(note) {
        this._note = note;
    }

    static getNotenBewertung(note) {
        switch (note) {
            case 1:
                return 'sehr gut';
            case 2:
                return 'gut';
            case 3:
                return 'befriedigend';
            case 4:
                return 'ausreichend';
            case 5:
                return 'mangelhaft';
            case 6:
                return 'ungenügend';
            default:
                return undefined;
        }
    }

    toString() {
        return 'Student {name=' + this._name + ', note=' + this._note + ', bewertung=' +
            Student.getNotenBewertung(this._note) + '}';
    }
}

module.exports = Student;
