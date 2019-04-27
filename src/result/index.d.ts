declare namespace SharePointService {
    class ResultMessage {
        constructor(success: string, data: any, message?: string);
        success: boolean;
        data: any;
        message: string;
    }
}

export default SharePointService.ResultMessage;