class TodoEntry {

    constructor(id, description, state) {
        this.id = id;
        this.description = description;
        this.state = state ? state : "open";
    }

    isOpen() {
        return this.state === "open";
    }

    toString() {
        return "TodoEntry {id=" + this.id + ", description=" + this.description + ", state=" + this.state + "}";
    }
}

module.exports = TodoEntry
