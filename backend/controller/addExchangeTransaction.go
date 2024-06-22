package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/dk6796/backend/database"
	"github.com/dk6796/backend/model"
	"fmt"
	"time"
)

func AddExchangeVoucherController(c *gin.Context){
	
	var body struct {
		UserID		uint
		VoucherID		uint
		ExchangeTime	time.Time
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}


	db := database.Connection()
	var exchange model.ExchangeVoucher
	exchange = model.ExchangeVoucher{
		UserID: body.UserID,
		VoucherID: body.VoucherID,
		ExchangeTime: body.ExchangeTime,
	}
	fmt.Println("EXCHANGE: ", exchange)
	db.Create(&exchange)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
	})
}