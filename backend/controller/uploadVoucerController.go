package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/dk6796/backend/database"
	"github.com/dk6796/backend/model"
)

func AddVoucherController(c *gin.Context){
	
	var body model.Voucher

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}


	db := database.Connection()
	var voucher model.Voucher
	voucher = model.Voucher{
		VoucherName: body.VoucherName,
		VoucherCost: body.VoucherCost,
		VoucherDesc: body.VoucherDesc,
		VoucherType: body.VoucherType,
		VoucherImage: body.VoucherImage,
		VoucherStock: body.VoucherStock,
	}
	
	db.Create(&voucher)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
	})
}