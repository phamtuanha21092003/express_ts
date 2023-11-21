class ErrorHandler extends Error {
    statusCode: number
    message: string
    constructor(statusCode: number, message: string) {
        super()
        this.statusCode = statusCode
        this.message = message
    }
}
class BadRequest extends ErrorHandler {
    details: string
    constructor(message: string, details: string) {
        super(400, message)
        this.details = details
    }
}

class Unauthorized extends ErrorHandler {
    constructor(message: string) {
        super(401, message)
    }
}

class Forbidden extends ErrorHandler {
    constructor(message: string) {
        super(403, message)
    }
}
class NotFound extends ErrorHandler {
    constructor(message: string) {
        super(404, message)
    }
}
class InternalError extends ErrorHandler {
    constructor(message: string) {
        super(500, message)
    }
}

export { BadRequest, Unauthorized, NotFound, Forbidden, InternalError }
