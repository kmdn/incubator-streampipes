/*
Copyright 2019 FZI Forschungszentrum Informatik

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package org.streampipes.connect.adapter.preprocessing.elements;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.streampipes.connect.adapter.model.pipeline.AdapterPipelineElement;
import org.streampipes.connect.adapter.preprocessing.transform.TransformationRule;
import org.streampipes.connect.adapter.preprocessing.transform.stream.EventRateTransformationRule;
import org.streampipes.connect.adapter.preprocessing.transform.stream.StreamEventTransformer;
import org.streampipes.model.connect.rules.Stream.EventRateTransformationRuleDescription;
import org.streampipes.model.connect.rules.Stream.StreamTransformationRuleDescription;
import org.streampipes.model.connect.rules.TransformationRuleDescription;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TransformStreamAdapterElement implements AdapterPipelineElement {

    private StreamEventTransformer eventTransformer;
    Logger logger = LoggerFactory.getLogger(TransformStreamAdapterElement.class);

    public TransformStreamAdapterElement() {
        eventTransformer = new StreamEventTransformer();
    }

    public TransformStreamAdapterElement(List<StreamTransformationRuleDescription> transformationRuleDescriptions) {
        List<TransformationRule> rules = new ArrayList<>();

        // transforms description to actual rules
        for (TransformationRuleDescription ruleDescription : transformationRuleDescriptions) {
            if (ruleDescription instanceof EventRateTransformationRuleDescription) {
                EventRateTransformationRuleDescription tmp = (EventRateTransformationRuleDescription) ruleDescription;
                rules.add(new EventRateTransformationRule(tmp.getAggregationTimeWindow(), tmp.getAggregationType()));
            }
        }

        eventTransformer = new StreamEventTransformer(rules);
    }

    public void addStreamTransformationRuleDescription(StreamTransformationRuleDescription ruleDescription) {
        if (ruleDescription instanceof EventRateTransformationRuleDescription) {
            EventRateTransformationRuleDescription tmp = (EventRateTransformationRuleDescription) ruleDescription;
            eventTransformer.addEventRateTransformationRule(new EventRateTransformationRule(tmp.getAggregationTimeWindow(), tmp.getAggregationType()));
        }
    }

    @Override
    public Map<String, Object> process(Map<String, Object> event) {
        return eventTransformer.transform(event);
    }
}
