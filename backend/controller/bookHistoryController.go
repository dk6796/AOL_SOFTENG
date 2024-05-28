package controller

import (
	"net/http"
    	"github.com/gin-gonic/gin"
    	"github.com/dk6796/backend/database"
    	"github.com/dk6796/backend/model"
	"fmt"
)

func BookHistoryController(c *gin.Context){

	var body model.BookHistory

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
			"details": c.Errors.String(),
		})
		return
	}

	db := database.Connection()
	var result model.BookHistory

	result = model.BookHistory{
		UserID: body.UserID,
		BookID: body.BookID,
		Level: body.Level,
		FinishTime: body.FinishTime,
	}
	db.Create(&result)

	fmt.Println("RESULT: ", result)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
		"bookHistoryID": result.BookHistoryID,
	})

}