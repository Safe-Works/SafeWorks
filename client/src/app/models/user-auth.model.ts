class UserAuthModel {
    constructor(
        public uid: string,
        public displayName: string,
        public email: string,
        public infos: any,
    ) { }
}

export default UserAuthModel;