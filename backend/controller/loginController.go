package controller

import (
	"net/http"
	"os"
	"time"
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/dk6796/backend/database"
    	"github.com/dk6796/backend/model"
	"golang.org/x/crypto/bcrypt"
)

func LoginController(c *gin.Context){
	var body struct {
		Email	string
		Password	string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var user model.User
	db := database.Connection()
	

	if err := db.First(&user, "email = ?", body.Email).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email belum terdaftar !",
		})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password salah !",
		})

		return
	}
	

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.UserID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid to created token",
		})

		return
	}

	// c.SetSameSite(http.SameSiteNoneMode)
	// c.SetCookie("Authorization", tokenString, 3600*24*30,"","",false, true)
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  time.Now().Add(1 * time.Hour),
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	fmt.Println("Ini datanya : ",user.FullName)
	userResponse := map[string]interface{}{
        "token": tokenString,
        "user": gin.H{
            "UserID":   user.UserID,
          //   "FullName":  user.FullName,
          //   "Email": user.Email,
		//   "ProfilePict": user.ProfilePict,
		//   "Role": user.Role,
		//   "TotalCoin": user.TotalCoin,
		//   "Level": user.Level,
		//   "BookCategory": user.BookCategory,
		//   "SaveBookID": user.SaveBookID,
		//   "SavePage": user.SavePage,
        },
    }

	c.JSON(http.StatusOK, userResponse)
}

func Validate(c *gin.Context){
	user, _ := c.Get("user")
	c.JSON(http.StatusOK, gin.H{
		"message": user,
	})
}

func LogOut(c *gin.Context){

	db := database.Connection()
	var user model.User
   
	if err := db.First(&user, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    "",
		Expires: time.Now().Add(-2 * 24 * time.Hour),
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	c.JSON(http.StatusOK, "testing")
}

