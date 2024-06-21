package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetExchangeVoucher(db *gorm.DB, c *gin.Context) {
	var exchange []model.ExchangeVoucher

	id := c.Query("id")
	err := db.Where("user_id = ?", id).Find(&exchange).Error
	if err != nil {
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read exchange data")
		return
	}

	c.AsciiJSON(http.StatusOK, exchange)
}

