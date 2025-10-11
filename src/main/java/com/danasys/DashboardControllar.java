package com.danasys;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danasys.dto.DasboardDetailsDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping
@Tag(name = "Dashboard management ", description = "APIs For dashboard management")
public class DashboardControllar {

	
	@GetMapping("/api/user/dashboardDetails/{userProfileId}/{planYear}")
	@Operation(summary = "Product category list", description = "All listed product category")
	public DasboardDetailsDTO dashboardDetails(@PathVariable Long userProfileId,@PathVariable int planYear) {
		DasboardDetailsDTO details = new DasboardDetailsDTO();
		
		
		return details;
		
	}
}
