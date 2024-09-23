module.exports = {
    "/api/v1/media/single": {
      post: {
        tags: ["Media"],
        summary: "Upload File",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "file",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Create New Upload File",
          },
        },
      },
    },
    "/api/v1/media/disk/single": {
      post: {
        tags: ["Media"],
        summary: "Upload File",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "file",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Create New Upload File",
          },
        },
      },
    },
    "/api/v1/media/multiple": {
      post: {
        tags: ["Media"],
        summary: "Upload Files",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: {
                    type: "array",
                    items: {
                      type: "file",
                      format: "binary",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Create New Upload File",
          },
        },
      },
    },
    "/api/v1/media/disk/multiple": {
      post: {
        tags: ["Media"],
        summary: "Upload Files",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: {
                    type: "array",
                    items: {
                      type: "file",
                      format: "binary",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Create New Upload File",
          },
        },
      },
    },
    "/api/v1/media": {
      get: {
        tags: ["Media"],
        summary: "Get All Medias",
        security: [
          {
            BearerAuth: [],
          },
        ],
        produces: ["application/json"],
        parameters: [
          {
            $ref: "#/components/parameters/offset",
          },
          {
            $ref: "#/components/parameters/limit",
          },
          {
            $ref: "#/components/parameters/sort",
          },
          {
            $ref: "#/components/parameters/order",
          },
        ],
        responses: {
          200: {
            description: "Get All media",
          },
        },
      },
    },
    "/api/v1/media/assets": {
      post: {
        tags: ["Media"],
        summary: "Upload File",
        security: [],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "file",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Create New Upload File",
          },
        },
      },
    },
  };
  