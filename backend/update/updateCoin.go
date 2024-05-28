package update

import (
   "net/http"
   "github.com/gin-gonic/gin"
   "github.com/dk6796/backend/database"
   "github.com/dk6796/backend/model"
   "fmt"
)

func UpdateCoin(c *gin.Context) {
	var body struct {
		TotalCoin uint
	}


	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

   	db := database.Connection()

	var user model.User
   
	if err := db.First(&user, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	fmt.Println("TOTAL COIN: ", body.TotalCoin)

	user.TotalCoin = body.TotalCoin

	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update",
		})
		return
	}


	c.JSON(http.StatusOK, gin.H{
		"message": "Success",
	})
}
