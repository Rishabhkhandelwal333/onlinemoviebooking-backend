const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../midlleware/cathAsyncErrors");
const Movie = require("../models/movieModel");

//create new order

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    console.log(req.body);
    
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });
    res.status(201).json({
       success: true,
       order,
    });

});

//get single order of user  


exports.getSingleOrder =  catchAsyncErrors ( async (req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new ErrorHandler("order not found with this Id",404));
    }

    res.status(200).json({
        success:true,
        order,
    })
})

//get looged in people order 


exports.myOrders =  catchAsyncErrors ( async (req,res,next)=>{

    const orders = await Order.find({user :req.user._id});

    res.status(200).json({
        success:true,
        orders,
    })
})

//get all orders -- admin 


exports.getAllOrders =  catchAsyncErrors ( async (req,res,next)=>{

    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    });

    res.status(200).json({
        success:true,
        orders,
        totalAmount,
    })
})

//update Order Status --Admin

exports.updateOrderStatus =  catchAsyncErrors ( async (req,res,next)=>{

    const order = await Order.findById(req.params.id);

     
    if(!order){
        return next(new ErrorHandler("Ticket not found with this Id",404));
    }
 
    
    if(order.orderStatus === "TicketBooked"){
        return next(new ErrorHandler("You have already booked this ticket",400));
    }

    //update stock 
    if(order.orderStatus === "Processing"){

        order.orderItems.forEach(async(o)=>{
            await updateStock(o.movie,o.quantity);
        });
    
    }

    
 // update status

    order.orderStatus = req.body.status;
    
    await order.save({validateBeforeSave: false });
    res.status(200).json({
        success:true,
    })
})

// update seats

async function updateStock (id,quantity){
    const movie = await Movie.findById(id);
    movie.seats -= quantity;
 await movie.save({validateBeforeSave: false });
}

//delete order --admin 

exports.deleteOrder =  catchAsyncErrors ( async (req,res,next)=>{

    const order = await Order.findById(req.params.id);
   
    if(!order){
        return next(new ErrorHandler("order not found with this Id",404));
    }

    await order.remove();

    res.status(200).json({
        success:true,
       
    })
})
