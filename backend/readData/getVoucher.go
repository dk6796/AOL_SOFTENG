package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetVoucher(db *gorm.DB, c *gin.Context) {
	var voucher []model.Voucher

	err := db.Find(&voucher).Error

	if err != nil {
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read voucher data")
		return
	}

	c.AsciiJSON(http.StatusOK, voucher)
}