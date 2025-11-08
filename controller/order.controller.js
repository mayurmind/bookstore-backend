import Order from "../model/order.model.js";
import Book from "../model/bookmodel.js";
import User from "../model/usermodel.js";

export const placeOrder = async (req, res) => {
    try {
        const userId=req.user.id;
        const { books } = req.body;

        if (!books?.length) {
            return res.status(400).json({
                message: "no books provided"
            })
        }
        let totalPrice=0;
        const orderedBooks=[]

        for(const {bookId,quantity=1} of books){
            const book=await Book.findById(bookId);
            console.log(book)
            if (!book) {
            return res.status(404).json({
                message: "Book not found"
            })
        }
        if(book.stock<quantity){
            return res.status(400).json({
                message: "out of stock"
            })
        }
        totalPrice+=book.price*quantity;
        orderedBooks.push(book._id)

        book.stock-=quantity;
        await book.save()
        }

        const order=await Order.create({
            user:userId,
            book:orderedBooks,
            totalPrice,
            status:"placed"
        })

        await User.findByIdAndUpdate(userId,{$push:{orders:order._id}})

        res.status(201).json({
            success: true,
            message: "Order placed",
            order
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("book", "title author price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error("Get order history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};