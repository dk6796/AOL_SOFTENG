package model

import "time"

type User struct {
	UserID		uint			`gorm:"primaryKey"`
	FullName		string
	DOB			string
	Email		string
	Password		string
	ProfilePict	string
	TotalCoin		uint
	Level		uint
	Role			string
	SaveBookID	uint
	SavePage		uint
	BookCategory	string
}

type BookHistory struct {
	BookHistoryID 	uint 		`gorm:"primaryKey"`
	UserID		uint
	User			User			`gorm:"foreignKey:UserID"`
	BookID		uint
	Book			Book			`gorm:"foreignKey:BookID"`
	Level		uint
	FinishTime	time.Time
}

type QuizResult struct {
	ResultID		uint 		`gorm:"primaryKey"`
	BookHistoryID	uint
	BookHistory	BookHistory	`gorm:"foreignKey:BookHistoryID"`
	TotalCorrect	uint
	CorrectStreak	uint
	CoinEarned	uint
}