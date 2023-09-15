const confirmation = (req, res, next) => {
    const { width, height, bombs } = req.body
    if (!width || width < 8 || width > 50) {
        next({ status: 500, message: 'Width must be between 8 and 50' })
    } else if (!height || height < 8 || height > 50) {
        next({ status: 500, message: 'Width must be between 8 and 50' })
    } else if (!bombs || bombs < 1 || bombs > (width !== 0 && height !== 0 
        ? (
            (width*height)/2 <=999 
            ? Math.floor((width*height)/2) 
            : 999
        ) 
        : 32)) {
            next({ status: 500, message: `Bombs must be between 1 and ${
                (width !== 0 && height !== 0 
                    ? (
                        (width*height)/2 <=999 
                        ? Math.floor((width*height)/2) 
                        : 999
                    ) 
                    : 32)
                }`
            })
    } else {
        next()
    }
}

module.exports = {
    confirmation
}