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
    if (!space.data.cargo)
        return "You are not carrying any cargo that can be sold.";
    var name = Trade.TRADE_GOOD_NAMES[space.data.cargo.id];
    var price = Trade.TRADE_GOOD_PRICES[space.data.cargo.id];
    return "You can sell your " + space.data.cargo.quantity + " units of " +
        name + " at the Exchange. The market value per unit is " + price + " credits.";
};

Trade.buyGood = function(planet) {
    var transactionResult = {
        title: "Unable to Purchase",
        icon: "test_icon",
        text: ""
    };
    var name = Trade.TRADE_GOOD_NAMES[Trade.getTradeGood(planet)];
    if (space.data.cargo) {
        transactionResult.text = "You must sell any cargo you are carrying before purchasing more.";
        return transactionResult;
    }
    var pricePerUnit = Math.ceil(Trade.TRADE_GOOD_PRICES[Trade.getTradeGood(planet)] *
        (1 - calculateNegotiationBonus()));
    var maxAffordableUnits = Math.floor(space.data.credits / pricePerUnit);
    if (maxAffordableUnits == 0) {
        transactionResult.text = "You can't afford a single unit of " + name + ".";
        return transactionResult;
    }
    var unitsToPurchase = Math.min(maxAffordableUnits, space.data.maxCargo);
    var totalPrice = unitsToPurchase * pricePerUnit;
    transactionResult.title = "Purchased " + name;
    transactionResult.icon = "test_icon";
    transactionResult.text = "You purchased " + unitsToPurchase +
        " units of " + name + ". ";
    if (calculateNegotiationBonus() > 0)
        transactionResult.text += "Because of your skill in negotation, you receive " +
        "a " + (calculateNegotiationBonus() * 100).toFixed(0) + "% discount on the goods. ";
    transactionResult.text += "Your total comes to " + totalPrice + ".";
    transactionResult.result = function() {
        space.data.cargo = {};
        space.data.cargo.id = Trade.getTradeGood(planet);
        space.data.cargo.quantity = unitsToPurchase;
        space.data.cargo.purchasedAt = planet.id;
        space.data.credits -= totalPrice;
    };
    return transactionResult;
};

Trade.sellGood = function(planet) {
    if (!space.data.cargo)
        return {
            title: "No Cargo to Sell",
            icon: "test_icon",
            text: "Your cargo hold is empty. Purchase cargo from another planet to sell it here."
        };
    if (space.data.cargo.purchasedAt == planet.id)
        return {
            title: "Unable to Sell",
            icon: "test_icon",
            text: "This Exchange won't purchase goods that it sold to you."
        };
    var name = Trade.TRADE_GOOD_NAMES[space.data.cargo.id];
    var sellPrice = Math.ceil(Trade.TRADE_GOOD_PRICES[space.data.cargo.id] *
        (1 + calculateNegotiationBonus()) * space.data.cargo.quantity);
    var result = {};
    result.title = "Sold " + name;
    result.icon = "test_icon";
    result.text = "You sold " + space.data.cargo.quantity + " units of " + name +
        " for " + sellPrice + ".";
    if (calculateNegotiationBonus() > 0)
        result.text += " You were able to negotiate for a " +
        (calculateNegotiationBonus() * 100).toFixed(0) + " higher sale price.";
    result.result = function() {
        space.data.cargo = null;
        space.data.credits += sellPrice;
    };
    return result;
};

var calculateNegotiationBonus = function() {
    var bonus = 0;
    if (space.data.negotiationSkill == 3) bonus += .2;
    else if (space.data.negotiationSkill == 2) bonus += .1;
    return bonus;
};

module.exports = Trade;