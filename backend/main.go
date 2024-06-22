package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/dk6796/backend/database"
	"github.com/dk6796/backend/model"
	"github.com/dk6796/backend/controller"
	"github.com/dk6796/backend/middleware"
	"github.com/dk6796/backend/readData"
	// "github.com/dk6796/backend/seed"
	"github.com/dk6796/backend/update"
)

func main(){
	db := database.Connection()
	model.Migrate(db)
	// seed.SeedUser(db)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Set-Cookies", "Content-Type", "Content-Length", "Accept-Encoding", "token", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	router.POST("/register",controller.RegisterController)
	router.POST("/login",controller.LoginController)
	router.PUT("/logout/:id", controller.LogOut)
	router.GET("/validate", middleware.RequireAuth , controller.Validate)

	router.POST("/uploadBook",controller.UploadBookController)
	router.GET("/readBook", func(c *gin.Context){
		readData.GetBook(db, c)
	})

	router.GET("/getBooks", func(c *gin.Context){
		readData.GetBookByLevel(db, c)
	})

	router.GET("/getBookByID", func(c *gin.Context){
		readData.GetBookByID(db, c)
	})

	router.POST("/addQuestion",controller.AddQuestionController)
	router.GET("/getQuestion", func(c *gin.Context){
		readData.GetAllQuestion(db, c)
	})
	router.POST("/addOption",controller.AddOptionController)
	router.GET("/getOption", func(c *gin.Context){
		readData.GetAllOption(db, c)
	})

	router.POST("/addQuizResult",controller.QuizResultController)
	router.GET("/getQuizResult", func(c *gin.Context){
		readData.GetQuizResult(db, c)
	})
	router.GET("/getQuizResultByID", func(c *gin.Context){
		readData.GetQuizResultByID(db, c)
	})

	router.POST("/addBookHistory",controller.BookHistoryController)
	router.GET("/getBookHistory", func(c *gin.Context){
		readData.GetBookHistory(db, c)
	})
	router.GET("/getBookHistoryByID", func(c *gin.Context){
		readData.GetBookHistoryByID(db, c)
	})

	router.GET("/getUser", func(c *gin.Context){
		readData.GetUser(db, c)
	})

	router.POST("/addVoucher",controller.UploadVoucherController)
	router.GET("/getVoucher", func(c *gin.Context){
		readData.GetVoucher(db, c)
	})

	router.POST("/addExchangeVoucher",controller.AddExchangeVoucherController)
	router.GET("/getExchangeVoucher", func(c *gin.Context){
		readData.GetExchangeVoucher(db, c)
	})

	router.PUT("/updateCategory/:id", update.UpdateCategoryBook)
	router.PUT("/updateReadBook/:id", update.UpdateReadBook)
	router.PUT("/updateCoin/:id", update.UpdateCoin)
	router.PUT("/updateStock/:id", update.UpdateStock)
	router.PUT("/updateLevel/:id", update.UpdateLevel)

	router.Run(":8080")
}