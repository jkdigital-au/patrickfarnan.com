const stripe = require('./stripe');

const setFrequency = freq => {
    switch(freq) {
        case 'Daily': 
            return 'day';
        case 'Weekly': 
            return 'week';
        case 'Monthly':
            return 'month';
        case 'Yearly':
            return 'year';
    }
}

module.exports = async (service, product) => {

    try {
        const price = await stripe.prices.create({
            currency: 'aud',
            product,
            recurring: {
                interval: setFrequency(service.paymentType.frequency)
            }, 
            unit_amount: (service.price.discounted) ? (service.price.discountedPrice * 100) : (service.price.price * 100),
            metadata: {
                discountPrice: service.price.discountedPrice,
                price: service.price.price,
                discounted: service.price.discounted
            },
        });
    
        return {price}
    } catch(error) {
        throw 'Error creating price in Stripe.';
    }
}