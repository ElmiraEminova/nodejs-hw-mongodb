// import createHttpError from "http-errors";

// export const notFoundHandler = (req, res, next) => {
//     next(createHttpError(404, "Route not found"));
// };

export const notFoundHandler = (req, res)=> {
    res.status(404).json({
        message: "Route not found"
    });
};


