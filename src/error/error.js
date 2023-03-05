class ErrorClass extends Error {
    constructor(message, type){
        super(message)
        this.type = type
    }
};

export { ErrorClass as Error }