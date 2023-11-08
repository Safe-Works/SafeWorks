import UserRepository from "../repositories/UserRepository";
import User from "../models/User";
import { Request, Response } from "express";

const userRepository = new UserRepository;

class UserController {

    async add(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/users'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint to add User'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['User']
        */
        try {
            /*
                #swagger.parameters['user'] = {
                    in: 'body',
                    description: 'User data to add',
                    required: true,
                    schema: { $ref: "#/definitions/AddUser" }
                }
            */
            const user: User = req.body;
            const result = await userRepository.add(user);
            /* 
                #swagger.responses[201] = { 
                    schema: { $ref: "#/definitions/CreatedUser" },
                    description: 'Created user JWT token' 
                } 
            */
            res.status(201).json({ statusCode: 201, token: result });
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error to add user:', error.message);
                if (error.message.includes('The email address is already in use by another account.')) {
                    /* 
                        #swagger.responses[409] = { 
                            schema: { $ref: "#/definitions/ConflictEmail" },
                            description: 'Email already exists' 
                        } 
                    */
                    res.status(409).json({ statusCode: 409, error: 'email/already-exists', message: error.message });
                } else {
                    /* 
                        #swagger.responses[500] = { 
                            schema: { $ref: "#/definitions/FailedAction" },
                            description: 'Action fail' 
                        } 
                    */
                    res.status(500).json({ statusCode: 500, error: 'user/failed-add', message: error.message });
                }
            }
        }
        // #swagger.end
    }

    async helpRequest(req: Request, res: Response): Promise<void> {
        try {
            const helpRequest: any = req.body;
            const result = await userRepository.helpRequest(helpRequest);
            res.status(201).json({ statusCode: 201, token: result });
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error to send help request:', error.message);

                res.status(500).json({ statusCode: 500, error: 'user/failed-help-request', message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/users/{uid}'
            #swagger.method = 'get'
            #swagger.description = 'Endpoint to get a User by ID'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['User']
        */
        try {
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'User UID',
                    required: true
                }
            */
            const uid = req.params.uid;
            const result = await userRepository.getById(uid);

            if (result) {
                /* 
                    #swagger.responses[200] = { 
                        schema: { $ref: "#/definitions/User" },
                        description: 'User response object' 
                    } 
                */
                res.status(200).json({ statusCode: 200, user: result })
            } else {
                res.status(404).json({ statusCode: 404, error: 'user/not-found' }) // #swagger.responses[404]
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get user by id:', error.message);
                /* 
                    #swagger.responses[500] = { 
                        schema: { $ref: "#/definitions/FailedAction" },
                        description: 'Action fail' 
                    } 
                */
                res.status(500).json({ statusCode: 500, error: 'user/failed-get', message: error.message });
            }
        }
        // #swagger.end
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await userRepository.getAll();
            if (users) {
                res.status(200).json({ statusCode: 200, users: users });
            } else {
                res.status(404).json({ statusCode: 404, error: 'users/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get all users: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'users/failed-getAll', message: error.message });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/users/{uid}'
            #swagger.method = 'put'
            #swagger.description = 'Endpoint to update a User'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['User']
        */
        try {
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'User UID',
                    required: true
                }
            */
            const uid = req.params.uid;
            /*
                #swagger.parameters['user'] = {
                    in: 'body',
                    description: 'User data to update',
                    required: true,
                    schema: { $ref: "#/definitions/AddUser" }
                }
            */
            const user: User = req.body;
            const photo = req.file;
            user.uid = uid;
            const result = await userRepository.update(user, photo);

            if (result) {
                /* 
                #swagger.responses[201] = { 
                    schema: { $ref: "#/definitions/CreatedUser" },
                    description: 'Updated user JWT token' 
                } 
                */
                res.status(200).json({ statusCode: 201, token: result })
            } else {
                res.status(404).json({ statusCode: 404, error: 'user/not-found' }) // #swagger.responses[404]
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error update get user:', error.message);
                /* 
                    #swagger.responses[500] = { 
                         schema: { $ref: "#/definitions/FailedAction" },
                        description: 'Action fail' 
                    } 
                */
                res.status(500).json({ statusCode: 500, error: 'user/failed-update', message: error.message });
            }
        }
        // #swagger.end
    }

    async login(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/users/login'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint to login a User'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['User']
        */
        try {
            /*
                #swagger.parameters['user'] = {
                    in: 'body',
                    description: 'User data to login',
                    required: true,
                    schema: { $ref: "#/definitions/LoginUser" }
                }
            */
            const user: User = req.body;
            /*
                #swagger.parameters['accessToken'] = {
                    in: 'header',
                    description: 'User access token to login',
                    required: false
                }
            */
            const accessToken: string = req.header('accessToken') ?? '';
            const result = await userRepository.login(user, accessToken);
            /* 
                #swagger.responses[401] = { 
                    schema: { $ref: "#/definitions/LoggedUser" },
                    description: 'Logged user JWT token' 
                } 
            */
            res.status(200).send({ statusCode: 200, customTokenJwt: result })
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to login user:', error.message);
                if (error.message.includes('auth/wrong-password')) {
                    /* 
                        #swagger.responses[400] = { 
                            description: 'Wrong password' 
                        } 
                    */
                    res.status(400).json({ statusCode: 400, error: 'auth/wrong-password', message: error.message });
                }
                else if (error.message.includes('temporarily disabled')) {
                    /* 
                        #swagger.responses[400] = { 
                            description: 'User login temporarily disabled' 
                        } 
                    */
                    res.status(400).json({ statusCode: 400, error: 'auth/access-disabled', message: error.message });
                } else {
                    /* 
                        #swagger.responses[500] = { 
                            schema: { $ref: "#/definitions/FailedAction" },
                            description: 'Action fail' 
                        } 
                    */
                    res.status(500).json({ statusCode: 500, error: 'auth/failed-login', message: error.message });
                }
            }
        }
        // #swagger.end
    }

    async upload(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/users/upload'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint to upload a User image file'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['User']
        */
        try {
            /*
                #swagger.parameters['file'] = {
                    in: 'formData',
                    type: 'file',
                    description: 'Image file to upload',
                    required: true
                }
            */
            const file = req.file;
            /*
                #swagger.parameters['uid'] = {
                    in: 'formData',
                    type: 'string',
                    description: 'User UID',
                    required: true
                }
            */
            const userUid: string = req.body.uid;
            if (file) {
                const result = await userRepository.uploadUserPhoto(file.path, file.mimetype, userUid);
                /* 
                #swagger.responses[200] = { 
                    schema: { $ref: "#/definitions/UploadedUserPhoto" },
                    description: 'Uploaded user photo url' 
                } 
                */
                res.status(200).json({ statusCode: 200, image: result });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to upload user photo:', error.message);
                if (error.message.includes('NOT_FOUND')) {
                    res.status(404).json({ statusCode: 404, error: 'user/user-not-found', message: error.message });
                } else {
                    res.status(500).json({ statusCode: 500, error: 'upload/failed', message: error.message });
                }
            }
        }
        // #swagger.end
    }

}

export default UserController;