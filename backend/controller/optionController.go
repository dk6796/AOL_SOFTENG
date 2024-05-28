package controller

import (
	"net/http"
    	"github.com/gin-gonic/gin"
    	"github.com/dk6796/backend/database"
    	"github.com/dk6796/backend/model"
)

func AddOptionController(c *gin.Context){

	var body model.Option

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
			"details": c.Errors.String(),
		})
		return
	}

	db := database.Connection()
	var option model.Option

	option = model.Option{
		QuestionID: body.QuestionID,
		Option: body.Option,
		IsAnswer: body.IsAnswer,
	}
	db.Create(&option)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
	})

}