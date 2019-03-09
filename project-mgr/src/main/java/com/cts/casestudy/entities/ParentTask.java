package com.cts.casestudy.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Size;

import org.hibernate.annotations.GenericGenerator;

@Entity
public class ParentTask {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
	private Integer id;
	
	@Size(max = 100)
	private String task;

	public Integer getId() {
		return id;
	}	

	public void setId(Integer id) {
		this.id = id;
	}

	public void setTask(String task) {
		this.task = task;
	}

	public String getTask() {
		return task;
	}
	
	public ParentTask(Integer id, String task) {
		super();
		this.id = id;
		this.task = task;
	}
	
	public ParentTask() {
		super();
	}
}
