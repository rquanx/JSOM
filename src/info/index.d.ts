declare namespace SharePointService {

    class ServiceInfo {
        constructor(site?: string, listTitle?: string, listId?: string);
        site: string;
        listTitle: string;
        listId: string;
        context: any;
        web: any;
        currentContext: any;
        currentWeb: any;
    }
}
export default SharePointService.ServiceInfo;