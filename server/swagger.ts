const swaggerAutogen = require('swagger-autogen')()

const endpointRouters = ['./src/controllers/JobAdController.ts', './src/controllers/PortfolioController.ts', './src/controllers/UserController.ts'];
const swaggerFile = './swagger.json';

const doc = {
    swagger: "2.0",
    info: {
        description: "This is the Swagger Documentation of SafeWorks server API",
        version: "1.0.0",
        title: "SafeWorks API"
    },
    host: "localhost:3001",
    basePath: "/api",
    schemes: ["http", "https"],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: "JobAd",
            descriptions: "Job Advertsiments endpoints",
        },
        {
            name: "Portfolio",
            descriptions: "Portfolio endpoints",
        },
        {
            name: "User",
            descriptions: "User endpoints",
        },
    ],
    definitions: {
        User: {
            statusCode: 200,
            user: {
                uid: "SXn2duju1bS6uXRZBKgXoVbC43D2",
                email: "lucas@email.com",
                password: "@Password1234",
                name: "Lucas",
                username: "lucaskleal",
                cpf: "45644283062",
                telephone_number: "41935610501",
                district: "Centro",
                photo_url: "https://1231245",
                balance: 0,
                contracted_services: [],
                worker: {
                    area: ["Carpinteiro"],
                    portfolio: "huHwBD3gTccU7pgA3Z94"
                },
                created: "19/06/2023, 18:23:02",
                modified: null,
                deleted: null,
                accessToken: "fgjdfgldfgprk"
            }
        },
        AddUser: {
            $email: "lucas@email.com",
            $password: "@Password1234",
            $name: "Lucas",
            $cpf: "45644283062",
            $telephone_number: "41935610501"
        },
        CreatedUser: {
            statusCode: 201,
            token: "asda231234afasfg3dsfsd"
        },
        ConflictEmail: {
            statusCode: 409,
            error: 'email/already-exists', 
            message: 'Email already exits...'
        },
        LoginUser: {
            $email: "lucas@email.com",
            $password: "@Password1234"
        },
        LoggedUser: {
            statusCode: 401,
            token: "asda231234afasfg3dsfsd"
        },
        UploadedUserPhoto: {
            statusCode: 200,
            image: "https://SXn2duju1bS6uXRZBKgXoVbC43D2_profile_photo"
        },

        JobAd: {
            statusCode: 200,
            job: {
                uid: "1YS5YRafCyUThV1kEucM",
                worker: {
                    name: "Lucas",
                    id: "NESmmmshXaSSeYHMB5FtU0l2hTg2"
                },
                title: "Teste",
                description: "Descrição",
                category: {
                    name: "Carpinteiro",
                    id: 1
                },
                district: {
                    name: "Água Verde",
                    id: 1
                },
                price: 10,
                price_type: {
                    name: "Dia",
                    id: 1
                },
                displacement_fee: 0,
                delivery_time: 1,
                media: ["https://media1.com"],
                contracts: ["23S5YRafCyUThV1kEu23"],
                expired: false,
                created: "06/07/2023 18:32:28",
                modified: "07/07/2023 18:32:28",
                deleted: null,
            }
        },
        AllJobAds: {
            jobs: [
                {
                    uid: "1YS5YRafCyUThV1kEucM",
                    worker: {
                        name: "Lucas",
                        id: "NESmmmshXaSSeYHMB5FtU0l2hTg2"
                    },
                    title: "Teste",
                    description: "Descrição",
                    category: {
                        name: "Carpinteiro",
                        id: 1
                    },
                    district: {
                        name: "Água Verde",
                        id: 1
                    },
                    price: 10,
                    price_type: {
                        name: "Dia",
                        id: 1
                    },
                    displacement_fee: 0,
                    delivery_time: 1,
                    media: ["https://media1.com"],
                    contracts: ["23S5YRafCyUThV1kEu23"],
                    expired: false,
                    created: "06/07/2023 18:32:28",
                    modified: "07/07/2023 18:32:28",
                    deleted: null,
                },
                {
                    uid: "1YS5YRafCyUThV1kEucM",
                    worker: {
                        name: "Lucas",
                        id: "NESmmmshXaSSeYHMB5FtU0l2hTg2"
                    },
                    title: "Teste",
                    description: "Descrição",
                    category: {
                        name: "Carpinteiro",
                        id: 1
                    },
                    district: {
                        name: "Água Verde",
                        id: 1
                    },
                    price: 10,
                    price_type: {
                        name: "Dia",
                        id: 1
                    },
                    displacement_fee: 0,
                    delivery_time: 1,
                    media: ["https://media1.com"],
                    contracts: ["23S5YRafCyUThV1kEu23"],
                    expired: false,
                    created: "06/07/2023 18:32:28",
                    modified: "07/07/2023 18:32:28",
                    deleted: null,
                },
            ],
            total: 2,
            currentPage: 1
        },
        AddJobAd: {
            $title: "Teste",
            $description: "Descrição",
            $category: {
                id: 6,
                name: "Carpinteiro"
            },
            $district: {
                id: 1,
                name: "Água Verde"
            },
            $price: 11,
            $price_type: {
                id: 1,
                name: "Dia"
            },
            $worker: {
                id: "NESmmmshXaSSeYHMB5FtU0l2hTg2",
                name: "Lucas"
            }
        },
        CreatedJobAd: {
            statusCode: 201,
            jobAd: "1YS5YRafCyUThV1kEucM"
        },

        Porfolio: {
            statusCode: 200,
            portfolio: {
                uid: "huHwBD3gTccU7pgA3Z94",
                user_uid: "NESmmmshXaSSeYHMB5FtU0l2hTg2",
                description: "Descrição",
                certifications: [
                    {
                        issue_date: "07/07/2023 18:32:28",
                        description: "Descrição",
                        id: "huHwBD3gTccU7pgA3Z941",
                        title: "Certificado",
                        issue_organization: "PUCPR",
                        certification_url: null
                    }
                ],
                years_experience: 1,
                created: "07/07/2023 18:32:28",
                modified: "08/07/2023 18:32:28",
                deleted: null
            }
        },
        AddPorfolio: {
            $user_uid: "NESmmmshXaSSeYHMB5FtU0l2hTg2",
            $description: "Descrição",
            $years_experience: 1
        },
        CreatedPorfolio: {
            statusCode: 200,
            portfolio: {
                uid: "huHwBD3gTccU7pgA3Z94",
                user_uid: "NESmmmshXaSSeYHMB5FtU0l2hTg2",
                description: "Descrição",
                certifications: [],
                years_experience: 1,
                created: "07/07/2023 18:32:28",
                modified: "08/07/2023 18:32:28",
                deleted: null
            }
        },
        AddCertification: {
            $title: "Certificado",
            $description: "Descrição Certificado",
            $issue_organization: "PUCR",
            $issue_date: "2023-07-20"
        },
        UpdatePortfolio: {
            description: "Descrição",
            years_experience: 1
        },
        FailedAction: {
            statusCode: 500,
            error: 'model/failed-action',
            message: 'Error on action...'
        },
        
    }
}

swaggerAutogen(swaggerFile, endpointRouters, doc);