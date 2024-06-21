package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/dk6796/backend/database"
	"github.com/dk6796/backend/model"
)

func AddExchangeVoucherController(c *gin.Context){
	
	var body model.ExchangeVoucher

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
	
	db.Create(&exchange)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
	})
}