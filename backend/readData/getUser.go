package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUser(db *gorm.DB, c *gin.Context) {
	var user model.User

	id := c.Query("id")

	err := db.Where("user_id = ?", id).Find(&user).Error

	if err != nil {
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read user data")
		return
	}

	c.AsciiJSON(http.StatusOK, user)
}

