class ResponseMessage {
    constructor(success) {
        this.success = success;
    }
}

class SuccessfulResponseMessage extends ResponseMessage {
    constructor(data) {
        super(true);
        if (data) {
            this.data = data;
        }
    }
}

class UnsuccessfulResponseMessage extends ResponseMessage {
    constructor(msg) {
        super(false);
        if (msg) {
            this.msg = msg;
        }
    }
}

module.exports = {
    ResponseMessage: ResponseMessage,
    SuccessfulResponseMessage: SuccessfulResponseMessage,
    UnsuccessfulResponseMessage: UnsuccessfulResponseMessage,
    ResponseMessageFactory: {
        createSuccessful: (data) => {
            return new SuccessfulResponseMessage(data);
        },
        createUnsuccessful: (msg) => {
            return new UnsuccessfulResponseMessage(msg)
        }
    }
};