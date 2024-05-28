package model

type Book struct {
	BookID		uint			`gorm:"primaryKey"`
	Title		string
	Author		string
	Publisher		string
	TotalPage		uint
	Synopsis		string
	CoverBook 	string
	Level		uint
	Category		string
	Genre  		string
	FilePDF 		string
}

type Question struct {
	QuestionID	uint			`gorm:"primaryKey"`
	BookID		uint
	Book			Book			`gorm:"foreignKey:BookID"`
	QuizQuestion	string
}

type Option struct {
	OptionID		uint			`gorm:"primaryKey"`
	QuestionID	uint
	Question		Question		`gorm:"foreignKey:QuestionID"`
	Option		string
	IsAnswer		bool
}



