package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/dk6796/backend/database"
	"github.com/dk6796/backend/model"
	"fmt"
)

func UploadVoucherController(c *gin.Context){
	
	var body struct {
		VoucherName 	string
		VoucherCost	uint
		VoucherDesc	string
		VoucherType  	string
		VoucherImage	string
		VoucherStock	uint
	}

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
	fmt.Println("VOUCHER: ", voucher)
	db.Create(&voucher)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
	})
}