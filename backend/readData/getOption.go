package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"fmt"
)

func GetAllOption(db *gorm.DB, c *gin.Context) {
	var option []model.Option

	err := db.Preload("Question").
		Find(&option).Error

	if err != nil {
		fmt.Println("Error fetching option list:", err)
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read option data")
		return
	}

	c.AsciiJSON(http.StatusOK, option)
}
