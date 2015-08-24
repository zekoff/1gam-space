/* global space */
var Trade = {};
Trade.TRADE_GOOD_NAMES = [
    'Organics',
    'Minerals',
    'Medicine',
    'Food',
    'Electronics',
    'Weapons'
];
Trade.TRADE_GOOD_PRICES = [
    10, // Organics
    15, // Minerals
    50, // Medicine
    20, // Food
    150, // Electronics
    75 // Weapons
];
var BUY_PRICE = 0.7; // Cost to buy planet specialty is 70% of market value

// Trade.TradeGood = function(id) {
//     this.id = id;
//     this.name = Trade.TRADE_GOOD_NAMES[id];
//     this.price = Trade.TRADE_GOOD_PRICES[id];
// };

Trade.getTradeGood = function(planet) {
    var tradeGoodId;
    switch (planet.type) {
        case 0: // Agricultural
            if (planet.economy == 0) { // Poor
                tradeGoodId = 0; // Organics
                break;
            }
            if (planet.government == 0) // Federal
                tradeGoodId = 2; // Medicine
            else tradeGoodId = 3; // Food
            break;
        case 1: // Industrial
            if (planet.economy == 0) { // Poor
                tradeGoodId = 1; // Minerals
                break;
            }
            if (planet.government == 0) // Federal
                tradeGoodId = 4; // Electronics
            else tradeGoodId = 5; // Weapons
            break;
    }
    return tradeGoodId;
};

Trade.getBuyText = function(planet) {
    var name = Trade.TRADE_GOOD_NAMES[Trade.getTradeGood(planet)];
    var price = Math.ceil(Trade.TRADE_GOOD_PRICES[Trade.getTradeGood(planet)] * BUY_PRICE);
    return "The Exchange here is selling " + name + " for " + price + " credits per unit.";
};

Trade.getSellText = function(planet) {
    if (space.data.cargoCarriedQuantity == 0)
        return "You are not carrying any cargo that can be sold.";
    var name = Trade.TRADE_GOOD_NAMES[space.data.cargoCarriedType];
    var price = Trade.TRADE_GOOD_PRICES[space.data.cargoCarriedQuantity];
    return "You can sell your " + space.data.cargoCarriedQuantity + " units of " +
        name + " at the Exchange. The market value per unit is " + price + " credits.";
};

Trade.buyGood = function(planet) {
    var transactionResult = {
        title: "Unable to Purchase",
        icon: "test_icon",
        text: ""
    };
    var name = Trade.TRADE_GOOD_NAMES[Trade.getTradeGood(planet)];
    if (space.data.cargoCarriedQuantity > 0 &&
        space.data.cargoCarriedType != Trade.getTradeGood(planet)) {
        transactionResult.text = "You are not able to mix cargo types in your hold. Please " +
            "sell the cargo you are currently carrying before purchasing a new type.";
        return transactionResult;
    }
    var pricePerUnit = Math.ceil(Trade.TRADE_GOOD_PRICES[Trade.getTradeGood(planet)] *
        calculateNegotiationDiscount());
    var maxAffordableUnits = Math.floor(space.data.credits / pricePerUnit);
    if (maxAffordableUnits == 0) {
        transactionResult.text = "You can't afford a single unit of " + name + ".";
        return transactionResult;
    }
    var maxTransportableUnits = space.data.maxCargo - space.data.cargoCarriedQuantity;
    if (maxTransportableUnits == 0) {
        transactionResult.text = "You can't hold any more cargo.";
        return transactionResult;
    }
    var unitsToPurchase = Math.min(maxAffordableUnits, maxTransportableUnits);
    var totalPrice = unitsToPurchase * pricePerUnit;
    transactionResult.title = "Purchased " + name;
    transactionResult.icon = "test_icon";
    transactionResult.text = "You purchased " + unitsToPurchase +
        " units of " + name + ". ";
    transactionResult.text += "Because of your skill in negotations, you receive " +
        "a " + ((1 - calculateNegotiationDiscount()) * 100) + "% discount on the goods. ";
    transactionResult.text += "Your total comes to " + totalPrice + ".";
    transactionResult.result = function() {
        space.data.cargoCarriedType = Trade.getTradeGood(planet);
        space.data.cargoCarriedQuantity += unitsToPurchase;
        space.data.credits -= totalPrice;
    };
    return transactionResult;
};

Trade.sellGood = function() {};

var calculateNegotiationDiscount = function() {
    var discount = 1;
    if (space.data.negotiationSkill == 3) discount -= .4;
    else if (space.data.negotiationSkill == 2) discount -= .2;
    return discount;
};

module.exports = Trade;