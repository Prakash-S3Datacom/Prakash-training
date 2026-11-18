import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "Task CRUD API",
            version: "1.0.0",
            description:
                "REST API documentation for managing tasks using Express and TypeScript."
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server"
            }
        ],

        tags: [
            {
                name: "Health",
                description: "API health check"
            },
            {
                name: "Tasks",
                description: "Task management operations"
            }
        ],

        components: {
            schemas: {
                Task: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1
                        },
                        title: {
                            type: "string",
                            example: "Complete Day 6 assignment"
                        },
                        description: {
                            type: "string",
                            example: "Complete the Task CRUD API documentation"
                        },
                        status: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "IN_PROGRESS",
                                "COMPLETED"
                            ],
                            example: "PENDING"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-11-13T05:30:00.000Z"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-11-13T05:30:00.000Z"
                        }
                    }
                },

                CreateTaskInput: {
                    type: "object",
                    required: ["title"],
                    properties: {
                        title: {
                            type: "string",
                            minLength: 1,
                            maxLength: 100,
                            example: "Learn Swagger"
                        },
                        description: {
                            type: "string",
                            maxLength: 500,
                            example: "Document all API endpoints"
                        },
                        status: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "IN_PROGRESS",
                                "COMPLETED"
                            ],
                            default: "PENDING",
                            example: "PENDING"
                        }
                    }
                },

                UpdateTaskInput: {
                    type: "object",
                    minProperties: 1,
                    properties: {
                        title: {
                            type: "string",
                            minLength: 1,
                            maxLength: 100,
                            example: "Finish Swagger documentation"
                        },
                        description: {
                            type: "string",
                            maxLength: 500,
                            example: "Document and test all endpoints"
                        },
                        status: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "IN_PROGRESS",
                                "COMPLETED"
                            ],
                            example: "IN_PROGRESS"
                        }
                    }
                },

                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        message: {
                            type: "string",
                            example: "Operation completed successfully"
                        },
                        data: {
                            type: "object"
                        }
                    }
                },

                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        message: {
                            type: "string",
                            example: "Task not found"
                        }
                    }
                }
            }
        }
    },

    apis: [
        "./src/routes/*.ts",
        "./src/app.ts"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;