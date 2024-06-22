package update

import (
   "net/http"
   "github.com/gin-gonic/gin"
   "github.com/dk6796/backend/database"
   "github.com/dk6796/backend/model"
   "fmt"
)

func UpdateStock(c *gin.Context) {
	var body struct {
		Stock uint
	}


	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

   	db := database.Connection()

	var voucher model.Voucher
   
	if err := db.First(&voucher, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	fmt.Println("TOTAL STOCK: ", body.Stock)

	voucher.VoucherStock = body.Stock

	if err := db.Save(&voucher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update",
		})
		return
	}


	c.JSON(http.StatusOK, gin.H{
		"message": "Success",
	})
}
