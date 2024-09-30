export const errorHandler = (error, req, res, next) => {
    res.json({
        status: 500,
        message: "Something went wrong",
    });
};
